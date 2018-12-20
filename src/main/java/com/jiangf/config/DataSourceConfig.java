package com.jiangf.config;

import com.baomidou.dynamic.datasource.DynamicDataSourceCreator;
import com.baomidou.dynamic.datasource.DynamicRoutingDataSource;
import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DataSourceProperty;
import groovy.util.logging.Commons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by JIANGF on 2018/12/20.
 * 动态添加数据源
 */
//@Component
public class DataSourceConfig {

    @Autowired //在需要的地方注入，然后调用相关方法增减数据源
    private DynamicRoutingDataSource dynamicRoutingDataSource;

    @Autowired
    private DynamicDataSourceCreator dynamicDataSourceCreator;

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
}
