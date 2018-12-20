package com.jiangf.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jiangf.model.LearnResouce;
import com.jiangf.model.OracleUser;
import com.jiangf.model.User;
import junit.framework.TestCase;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.List;

/**
 * Created by JIANGF on 2018/12/14.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserMapperTest extends TestCase {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OracleUserMapper oracleUserMapper;

    @Test
    public void testSelect() {
        List<User> user = userMapper.selectList(new QueryWrapper<>());

        List<OracleUser> oracleUsers = oracleUserMapper.selectList(new QueryWrapper<>());

        System.out.println(("----- selectAll method test ------"+user.size()));
        System.out.println(("----- selectAll method test ------" + oracleUsers.size()));

        // 插入分库1
        OracleUser ou =new OracleUser();
        ou.setUserId("123456");
        ou.setUserAcct("admin1234");
        ou.setUserAcctCn("测试数据");
        ou.setOperatorId("11");
        ou.setCreateTime(new Date());
        ou.setModifyTime(new Date());
        ou.setResActMapId("111");
        ou.setValidSign(0);

//        oracleUserMapper.insert(ou);

        // 插入主库1
        User u = new User();
        u.setId("2");
        u.setUserAcct("ceshi");
        u.setUserAcctCn("ceshi");

        userMapper.insert(u);


        List<User> user1 = userMapper.selectList(new QueryWrapper<>());
        List<OracleUser> oracleUsers1 = oracleUserMapper.selectList(new QueryWrapper<>());

        System.out.println(("----- selectAll method test ------"+user1.size()));
        System.out.println(("----- selectAll method test ------"+oracleUsers1.size()));
    }
}