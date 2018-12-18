package com.jiangf;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.jiangf.mapper")
public class SpringBootFrameworkApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootFrameworkApplication.class, args);
	}
}
