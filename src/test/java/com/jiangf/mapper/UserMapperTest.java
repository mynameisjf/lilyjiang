package com.jiangf.mapper;

import com.jiangf.model.LearnResouce;
import junit.framework.TestCase;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * Created by JIANGF on 2018/12/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserMapperTest extends TestCase {
    @Autowired
    private UserMapper userMapper;

    @Test
    public void testSelect() {
        System.out.println(("----- selectAll method test ------"));
    }
}