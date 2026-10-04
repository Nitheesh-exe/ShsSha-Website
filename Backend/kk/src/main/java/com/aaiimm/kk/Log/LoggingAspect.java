package com.aaiimm.kk.Log;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.aaiimm.kk.controller.*.*(..))")
    public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {

        String methodName = joinPoint.getSignature().getName();

        long start = System.currentTimeMillis();
        log.info("Started: {}", methodName);
        Object result = joinPoint.proceed();
        log.info("Finished: {} in {} ms",
                methodName,
                System.currentTimeMillis() - start);

        return result;
    }
}