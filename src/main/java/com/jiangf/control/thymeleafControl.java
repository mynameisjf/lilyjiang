package com.jiangf.control;

import com.jiangf.mapper.UserMapper;
import com.jiangf.model.LearnResouce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by JIANGF on 2018/12/5.
 */
@RestController
public class thymeleafControl {

    @Autowired
    UserMapper userMapper;

    @RequestMapping("/thymeleafTest")
    public ModelAndView index(){
        List<String> learnList =new ArrayList<String>();
        String bean =new String("官方参考文档Spring Boot Reference Guidehttp://docs.spring.io/spring-boot/docs/1.5.1.RELEASE/reference/htmlsingle/#getting-started-first-application");
        learnList.add(bean);
        bean =new String("官方SpriongBoot例子官方SpriongBoot例子https://github.com/spring-projects/spring-boot/tree/master/spring-boot-samples");
        learnList.add(bean);
        bean =new String("龙国学院Spring Boot 教程系列学习http://www.roncoo.com/article/detail/125488");
        learnList.add(bean);
        bean =new String("嘟嘟MD独立博客Spring Boot干货系列 http://tengj.top/");
        learnList.add(bean);
        bean =new String("后端编程嘟Spring Boot教程和视频 http://www.toutiao.com/m1559096720023553/");
        learnList.add(bean);
        bean =new String("程序猿DDSpring Boot系列http://www.roncoo.com/article/detail/125488");
        learnList.add(bean);
        bean =new String("纯洁的微笑Sping Boot系列文章http://www.ityouknow.com/spring-boot");
        learnList.add(bean);
        bean =new String("CSDN——小当博客专栏Sping Boot学习http://blog.csdn.net/column/details/spring-boot.html");
        learnList.add(bean);
        bean =new String("梁桂钊的博客Spring Boot 揭秘与实战http://blog.csdn.net/column/details/spring-boot.html");
        learnList.add(bean);
        bean =new String("林祥纤博客系列从零开始学Spring Boot http://412887952-qq-com.iteye.com/category/356333");
        learnList.add(bean);
        ModelAndView modelAndView = new ModelAndView("/index");
        modelAndView.addObject("learnList", learnList);
        return modelAndView;
    }
}
