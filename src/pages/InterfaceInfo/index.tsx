import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {Button, Card, Descriptions, Form, message, Input, Spin, Divider, Badge, Row, Col, Space, Statistic, Switch, Image} from 'antd';
import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceInfoUsingPOST,
} from '@/services/kyle-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import hljs from 'highlight.js'

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfoVO>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };


  useEffect(() => {
    loadData();

    // 配置 highlight.js
    hljs.configure({
      // 忽略未经转义的 HTML 字符
      ignoreUnescapedHTML: true
    })
    // 获取到内容中所有的code标签
    const codes = document.querySelectorAll('.dg-html pre code')
    codes.forEach((el) => {
      // 让code进行高亮
      hljs.highlightElement(el as HTMLElement)
    })
  }, []);

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });

      const ress = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(ress.data);

      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };


  function downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('sdkHelp', 'kyapi-client-sdk-0.0.1.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleDownload() {
    const url = 'http://localhost:7529/api/user/sdkHelp';
    downloadFile(url);
  }

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{<Switch disabled={true} checked={data.status === 0 ? false : true} />}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />

      {data ? (
          <Row gutter={16}>


            <Col span={12}>
              <Statistic title="接口调用次数" value= {data.totalNum}  valueStyle={{ color: '#3f8600',textAlign:'center',marginTop:-30 }}/>
            </Col>
            <Col span={12}>
              <Statistic title="接口剩余次数" value={data.leftNum}  valueStyle={{ color: '#cf1322',textAlign:'center',marginTop:-30 }}/>


              <Space direction="vertical" size="middle" style={{ width: '100%' }}>

                <Badge.Ribbon text="小提示" color="	#7B68EE">
                  <Card title="每日免费提供10次！" size="small">
                  </Card>
                </Badge.Ribbon>
              </Space>


            </Col>
          </Row>
        ) : (
          <>接口不存在</>
        )}

      <Divider />
      <Badge.Ribbon text="开发文档" color="#2db7f5">
      <Card title="API调用规则">
        <Button
        type={"primary"}
        onClick={async () => {
          await handleDownload();
        }}
        >SDK 下载
        </Button>
      </Card>
      </Badge.Ribbon>
      <Divider />
      <Card title="在线测试">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" loading={invokeLoading}>
        {/* {invokeRes} */}
        {/\.(gif|jpeg|png|webp|bmp|jpg)$/i.test(invokeRes) ? <Image width={400} src={invokeRes} /> : null}
        {/\.(gif|jpeg|png|webp|bmp|jpg)$/i.test(invokeRes) ? null : invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;

