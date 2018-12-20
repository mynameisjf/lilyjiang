package com.jiangf.util;

import com.jiangf.mapper.DictionaryMapper;
import com.jiangf.model.Dictionary;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by JIANGF on 2018/12/18.
 */
@Component
public class DictionaryUtil {

    @Autowired
    private DictionaryMapper dictionaryMapper;

    /**
     *
     * @param value     数据库查询出来的键值对
     * @param keyName   属性名
     * @param catalogId 字典项
     * @return
     * @throws Exception
     */
    public Map<String,Object> transType(Map<String,Object> value,String keyName,String catalogId) {
        String dicCode = (String)value.get(keyName);
        Map param = new HashMap<>();
        param.put("DIC_CODE",dicCode);
        param.put("CATALOG_ID",catalogId);

        List<Dictionary> dics = dictionaryMapper.selectByMap(param);
        if(dics.size() > 0){
            Dictionary dic = dics.get(0);
            value.put(keyName,dic.getDicValue());
        }

        return  value;
    }
}
