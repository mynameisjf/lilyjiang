package com.jiangf.util;

import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.metadata.Sheet;
import com.alibaba.excel.support.ExcelTypeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by JIANGF on 2018/12/18.
 */
@Component
public class EasyExcelUtil {

    @Autowired
    private DictionaryUtil dictionaryUtil;

    //
    private static DictionaryUtil oridictionaryUtil;

    @PostConstruct
    public void init() {
        oridictionaryUtil = dictionaryUtil;
    }

    public static void exportExcel(HttpServletResponse response, String fileName, String headerMap, List<Map<String, Object>> value) throws IOException {

        ServletOutputStream out = response.getOutputStream();
        // 获得EXCEL下载方法类
        ExcelWriter writer = EasyExcelFactory.getWriter(out, ExcelTypeEnum.XLSX, true);

        Sheet sheet1 = new Sheet(1, 0);
        // 设置自适应宽度
        sheet1.setAutoWidth(Boolean.TRUE);

        // 解析配置文件，把表头字段和相对应的属性放到LIST中,保证顺序不会乱
        List headList = new ArrayList<>();
        List objectList = new ArrayList<>();
        Map<String,DbField> dbFieldMap = new HashMap<>();
        String[] _headerMap = headerMap.split(",");

        // 如果查询大于0,则导出EXCEL，否则提示进行配置
        if(_headerMap.length > 0 ){
            for(int i=0;i<_headerMap.length;i++){
                // headValue[0] headValue[1] headValue[2] headValue[3]
                // 性别|user_sex_code|Dictionary|SEX_TYPE
                String[] headValue = _headerMap[i].split("\\|");
                headList.add(headValue[0]);
                objectList.add(headValue[1]);

                // 说明字段需要转码
                if(headValue.length == 4){
                    dbFieldMap.put(headValue[1],new DbField(headValue[1],headValue[2],headValue[3]));
                }
            }

            // 设置表头和样式区域
            sheet1.setHead(createStringHead(headList));

            // 设置内容和样式
            writer.write1(createListObject(value,objectList,dbFieldMap), sheet1);

            // 输出excel
            response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes("gb2312"), "ISO-8859-1") + ".xlsx");
            response.setHeader("Content-Type", "application/vnd.ms-excel");
            writer.finish();
            out.close();
        }else{
            System.err.println("无配置项，请检查是否已经配置!!");
        }
    }

    /**
     * EXCEL内容显示
     * @param values       EXCEL展示的内容
     * @param objectList   内容对应的属性名
     * @param dbFieldMap  需要转码的属性
     * @return
     */
    public static List<List<Object>> createListObject(List<Map<String, Object>> values, List<String> objectList, Map<String, DbField> dbFieldMap) {
        List<List<Object>> object = new ArrayList<>();
        // 迭代EXCEL展示的内容
        for(Map<String,Object> value : values){
            List<Object> da = new ArrayList<>();
            // 根据属性名，查询内容并放到展示中
            for(String key : objectList){
                DbField dbField = dbFieldMap.get(key);
                // 如果需要转码,则进行转码
                if(dbField != null){
                    da.add(transCode2Value(dbField, value).get(key));
                }else{
                    da.add(value.get(key));
                }

            }
            object.add(da);
        }
        return object;
    }





    private static Map<String, Object> transCode2Value(DbField dbField, Map<String, Object> value) {

        try {
            oridictionaryUtil.transType(value,dbField.name,dbField.catalog);
        } catch (Exception e) {
            e.printStackTrace();
            return value;
        }
        return value;

    }

    public static List<List<String>> createStringHead(List<String> list){
        List<List<String>> head = new ArrayList<>();
        for(String l : list){
            List<String> headCoulumn = new ArrayList<>();
            headCoulumn.add(l);
            head.add(headCoulumn);
        }
        return head;
    }

    public static class DbField {
        public String name;
        public String catalog;
        public String dicClzz;

        /**
         * 初始化方法
         * @param name     属性名
         * @param catalog  字典类型
         * @param dicClzz  调用的方法
         */
        public DbField(String name,String dicClzz, String catalog) {
            this.name = name;
            this.dicClzz = dicClzz;
            this.catalog = catalog;
        }
    }
}
