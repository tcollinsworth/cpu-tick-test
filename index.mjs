import newrelic from 'newrelic'
import delay from 'delay'

let x = 0

function go() {
  setTimeout(() => {
    newrelic.startBackgroundTransaction('fakeWork', () => {
      const tx = newrelic.getTransaction()
      let endTs = Date.now() + 10
      while (Date.now() < endTs) {
        ++x
      }
      go()
      tx.end()
    })
  }, 0)
}

// queue two so one is always waiting
go()
go()

let excessiveDelayCount = 0
while (true) {
  let endTs = Date.now() + 200
  await delay(100)
  const awakeTs = Date.now()
  if (awakeTs > endTs) {
    ++excessiveDelayCount
    newrelic.recordMetric('cpu-tick-test/excessiveDelayTimeMs', awakeTs - endTs)
    const excessTime = (awakeTs - endTs)
    const errMsg = `excessiveDelayCount: ${excessiveDelayCount.toLocaleString("en-US")}, excessiveDelayTimeMs: ${excessTime.toLocaleString("en-US")}`
    const error = new Error(errMsg)
    newrelic.noticeError(error, {
      excessiveDelayCount: excessiveDelayCount,
      excessiveDelayTimeMs: excessTime,
    })
    console.log(new Date().toISOString(), 'excessiveDelayCount', excessiveDelayCount.toLocaleString("en-US"), 'excessiveDelayTimeMs', excessTime.toLocaleString("en-US"))
  }
}