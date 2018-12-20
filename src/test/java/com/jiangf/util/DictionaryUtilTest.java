package com.jiangf.util;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.*;

/**
 * Created by JIANGF on 2018/12/19.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class DictionaryUtilTest {

    @Autowired
    private DictionaryUtil dictionaryUtil;

    @Test
    public void testTransType() throws Exception {
       //性别|user_sex_code|Dictionary|SEX_TYPE

        Map<String,Object> value = new HashMap<>();
        value.put("user_sex_code","01");

        dictionaryUtil.transType(value, "user_sex_code", "SEX_TYPE");
    }
}