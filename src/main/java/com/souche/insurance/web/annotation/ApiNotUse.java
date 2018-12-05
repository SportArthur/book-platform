package com.souche.insurance.web.annotation;

import static java.lang.annotation.ElementType.METHOD;

import java.lang.annotation.Target;

@Target(METHOD)
public @interface ApiNotUse {
	/**
	 * 
	 * @return
	 */
	String value() default "";
	
	String path() default "";
}
