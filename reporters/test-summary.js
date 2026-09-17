class TestSummaryReporter {
  constructor() {
    this.uniqueTests = new Map();
    this.passedCount = 0;
    this.failedCount = 0;
    this.skippedCount = 0;
  }

  onTestEnd(test, result) {
    const testKey = `${test.file}::${test.title}`;

    // Store only the final result (last attempt)
    this.uniqueTests.set(testKey, {
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error
    });

    const status = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
    console.log(`${status} ${test.title} [${result.duration}ms]`);

    if (result.error) {
      console.log(`   Error: ${result.error.message.split('\n')[0]}`);
    }
  }

  onEnd(result) {
    // Count only unique tests by final status
    let uniquePassed = 0;
    let uniqueFailed = 0;
    let uniqueSkipped = 0;

    for (const test of this.uniqueTests.values()) {
      if (test.status === 'passed') uniquePassed++;
      else if (test.status === 'failed') uniqueFailed++;
      else if (test.status === 'skipped') uniqueSkipped++;
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY (UNIQUE COUNTS - No Duplicates)');
    console.log('='.repeat(70));
    console.log(`Total Unique Test Cases: ${this.uniqueTests.size}`);
    console.log(`✅ Passed (Unique): ${uniquePassed}`);
    console.log(`❌ Failed (Unique): ${uniqueFailed}`);
    console.log(`⏭️  Skipped (Unique): ${uniqueSkipped}`);
    console.log(`⏱️  Total Duration: ${Math.round(result.duration / 1000)}s`);
    console.log('='.repeat(70) + '\n');
  }
}

module.exports = TestSummaryReporter;
