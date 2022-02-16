# cpu-tick-test - node.js

It runs a 10ms loop and reports the transaction to newrelic.

It concurrently sleeps 100ms and when it awakes, checks how long it slept. 
If it was over 200ms, then it reports it logs and reports to newrelic as an error with the timings.


build -t cpu-tick-test-node14alpine3 .

docker tag cpu-tick-test-node14alpine3 tcollinsworth/cpu-tick-test-node14alpine3:latest

https://hub.docker.com/repository/docker/tcollinsworth/cpu-tick-test-node14alpine3

docker run -e NEW_RELIC_LICENSE_KEY=c...L -d cpu-tick-test-node14alpine3

docker logs -f ac531f20267d

docker stop b243c1789977


kill -STOP <pid>
kill -CONT <pid>


# log output

```
2022-02-15T21:20:27.338Z excessiveDelayCount 1 excessiveDelayTimeMs 11,879
2022-02-15T21:26:12.136Z excessiveDelayCount 2 excessiveDelayTimeMs 16,922
2022-02-15T21:26:14.740Z excessiveDelayCount 3 excessiveDelayTimeMs 1,030
2022-02-15T21:26:16.815Z excessiveDelayCount 4 excessiveDelayTimeMs 885
2022-02-15T21:26:37.165Z excessiveDelayCount 5 excessiveDelayTimeMs 19,178
```