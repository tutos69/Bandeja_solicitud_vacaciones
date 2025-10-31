package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class VacationRequestTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static VacationRequest getVacationRequestSample1() {
        return new VacationRequest().id(1L).requestedDays(1).approverComment("approverComment1").approvedDays(1);
    }

    public static VacationRequest getVacationRequestSample2() {
        return new VacationRequest().id(2L).requestedDays(2).approverComment("approverComment2").approvedDays(2);
    }

    public static VacationRequest getVacationRequestRandomSampleGenerator() {
        return new VacationRequest()
            .id(longCount.incrementAndGet())
            .requestedDays(intCount.incrementAndGet())
            .approverComment(UUID.randomUUID().toString())
            .approvedDays(intCount.incrementAndGet());
    }
}
