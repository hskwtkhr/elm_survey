import { spawn } from 'child_process'

async function runTest() {
    console.log('Starting Security Verification on port 3001...')
    const baseUrl = 'http://localhost:3001'

    // 1. Verify API Protection
    console.log('\n[Test 1] Verifying API Protection...')
    try {
        const res = await fetch(`${baseUrl}/api/dashboard`, { redirect: 'manual' })
        console.log(`Requested /api/dashboard. Status: ${res.status}, Location: ${res.headers.get('location')}`)

        // Middleware redirects to /api/auth/signin or /login depending on configuration
        // Or returns 401
        // With 'manual' redirect, we expect 307/302/308 or 401.
        if (res.status === 401 || (res.status >= 300 && res.status < 400)) {
            console.log('✅ /api/dashboard is protected')
        } else {
            console.error('❌ /api/dashboard is NOT protected (Status:', res.status, ')')
        }
    } catch (e) {
        console.log('⚠️ Could not connect to localhost:3001. Is the server running?', e)
    }

    // 2. Verify Rate Limiting
    console.log('\n[Test 2] Verifying Rate Limiting...')

    let successCount = 0
    let blockedCount = 0

    for (let i = 0; i < 15; i++) {
        try {
            const res = await fetch(`${baseUrl}/api/survey`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Empty body will trigger validation error (400)
                    // But rate limit should kick in BEFORE or AFTER? 
                    // In my code: Rate limit check is FIRST.
                    // So first 10 requests -> 400 (counted as success for rate limit check?)
                    // Wait, I am inserting `ipHash` ONLY when `prisma.survey.create` is called.
                    // `prisma.survey.create` is called ONLY if validation passes.
                    // AH!!!!
                    // IF VALIDATION FAILS, I DO NOT SAVE TO DB.
                    // SO RATE LIMIT COUNT DOES NOT INCREASE.
                    // BUG FOUND.
                })
            })

            if (res.status === 429) {
                blockedCount++
                process.stdout.write('x')
            } else {
                successCount++
                process.stdout.write('.')
            }
        } catch (e) {
            console.error('Error:', e)
        }
    }
    console.log('\n')

    if (blockedCount > 0) {
        console.log(`✅ Rate limiting working. Blocked ${blockedCount} requests.`)
    } else {
        console.log('❌ Rate limiting NOT working. No requests blocked.')
        console.log('  -> Note: Rate limiting currently relies on DB insertion. If request is invalid, it is not counted!')
    }
}

runTest()
