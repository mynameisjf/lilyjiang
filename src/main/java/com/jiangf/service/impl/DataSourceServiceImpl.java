package com.jiangf.service.impl;

import com.baomidou.dynamic.datasource.DynamicDataSourceCreator;
import com.baomidou.dynamic.datasource.DynamicRoutingDataSource;
import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DataSourceProperty;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jiangf.mapper.OracleUserMapper;
import com.jiangf.service.DataSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by JIANGF on 2018/12/20.
 */
@Service
public class DataSourceServiceImpl implements DataSourceService {
    @Autowired //在需要的地方注入，然后调用相关方法增减数据源
    private DynamicRoutingDataSource dynamicRoutingDataSource;

    @Autowired
    private DynamicDataSourceCreator dynamicDataSourceCreator;

    @Autowired
    private OracleUserMapper oracleUserMapper;

    public void init(){

        // 构造参数
        DataSourceProperty property = new DataSourceProperty();
        property.setDriverClassName("oracle.jdbc.driver.OracleDriver");
        property.setUrl("jdbc:oracle:thin:@112.74.18.160:1521:orcl");
        property.setUsername("WHSY_FW");
        property.setPassword("WHSY_FW");

        // 新增数据源
        dynamicRoutingDataSource.addDataSource("oracle", dynamicDataSourceCreator.createDruidDataSource(property));
    }

    @DS("#tenantName")//使用spel从参数获取
    public List selectSpelByKey(String tenantName) {
        return oracleUserMapper.selectList(new QueryWrapper<>());
    }
}
