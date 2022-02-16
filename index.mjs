import newrelic from 'newrelic'
import delay from 'delay'

const grabMemSize = 90000000 // 1.5 GB
// const grabMemSize = 45000000 // 712 MB, 47% CPU, 90 ms CPU tick time
const grabMem1 = new Array(grabMemSize)
const grabMem2 = new Array(grabMemSize)

let x = 0
let reported = false

function go() {
  setTimeout(async () => {
    await delay(90)
    newrelic.startBackgroundTransaction('fakeWork', () => {
      const tx = newrelic.getTransaction()
      const endTs = Date.now() + 80
      while (Date.now() < endTs) {
        try {
          x++
          grabMem1[x % grabMemSize] = 12345.6789
          grabMem2[x % grabMemSize] = 12345.6789
          if (x % grabMemSize == 0 && !reported) {
            console.log('filled', grabMemSize * 2)
            reported = true
          }
        } catch (e) {
          console.log(x, x % grabMemSize, grabMem.length)
          throw e
        }
      }
      go()
      tx.end()
    })
  }, 0)
}

// queue two so one is always waiting
go()

let excessiveDelayCount = 0
while (true) {
  let endTs = Date.now() + 200
  await delay(100)
  const awakeTs = Date.now()
  if (awakeTs > endTs) {
    ++excessiveDelayCount
    newrelic.recordMetric('cpu-tick-test/excessiveDelayTimeMs', awakeTs - 100)
    const excessTime = (awakeTs - 100)
    const errMsg = `excessiveDelayCount: ${excessiveDelayCount.toLocaleString("en-US")}, excessiveDelayTimeMs: ${excessTime.toLocaleString("en-US")}`
    const error = new Error(errMsg)
    newrelic.noticeError(error, {
      excessiveDelayCount: excessiveDelayCount,
      excessiveDelayTimeMs: excessTime,
    })
    console.log(new Date().toISOString(), 'excessiveDelayCount', excessiveDelayCount.toLocaleString("en-US"), 'excessiveDelayTimeMs', excessTime.toLocaleString("en-US"))
  }
}
