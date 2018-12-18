package com.jiangf.control;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by JIANGF on 2018/12/5.
 */
@RestController
public class helloControl {

    @RequestMapping("/")
    public String index(){
        return "Hello Spring Boot";
    }


}
