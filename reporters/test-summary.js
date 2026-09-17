class TestSummaryReporter {
  onTestEnd(test, result) {
    const status = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
    console.log(`${status} ${test.title} [${result.duration}ms]`);

    if (result.error) {
      console.log(`   Error: ${result.error.message.split('\n')[0]}`);
    }
  }

  onEnd(result) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${result.stats.expected}`);
    console.log(`❌ Failed: ${result.stats.unexpected}`);
    console.log(`⏭️  Skipped: ${result.stats.skipped}`);
    console.log(`⏱️  Duration: ${Math.round(result.duration / 1000)}s`);
    console.log('='.repeat(60) + '\n');
  }
}

module.exports = TestSummaryReporter;
