import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {Button, List, message, Space} from 'antd';
import {
  listInterfaceInfoByPageUsingGET,
} from '@/services/kyle-backend/interfaceInfoController';
import {PayCircleOutlined} from "@ant-design/icons";
import {
  buyInterfaceUsingPOST,
} from "@/services/kyle-backend/userController";
import {getUserUsingGET} from "@/services/kyle-backend/keyController";

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentRow, setCurrentRow] = useState<number>();
  const [dataa, setDataa] = useState<API.User>();


  const loadData = async (current = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGET({
        current,
        pageSize,

      });

      const ress = await getUserUsingGET({
      });

      setDataa(ress.data);

      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const buyInterface = async (record: API.buyInterfaceUsingPOSTParams) => {
    const hide = message.loading('购买中');
    if (!record) return true;
    try {
      const resss = await buyInterfaceUsingPOST({
        id: record.id
      });


      hide();
      message.success(resss.data);
      return true;
    } catch (error: any) {
      hide();
      message.error('购买失败！！！' + error.message);
      return false;
    }
  };

  return (
    <PageContainer title="在线接口大全">
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;

          return (

            <List.Item actions={[

              <div >0.01元/一条</div>,

              item.status === 0 ? <a key={item.id}
              >不可购买</a>: null,
              item.status === 1 ?  <Button
                type="primary"
                key="offline"
                ghost
                onClick={() =>
                  {
                    buyInterface(item);
                  }
                }
              >
                点击购买
              </Button> : null,
            ]
            }
            >
              <Space>
                <PayCircleOutlined/>
                <span></span>
              </Space>
              <List.Item.Meta
                title={<a >{ item.description}</a>}
              />
            </List.Item>
          );
        }}
        pagination={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: 5,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
