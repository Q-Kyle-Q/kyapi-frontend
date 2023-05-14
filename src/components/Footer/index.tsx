import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
const Footer: React.FC = () => {
  const defaultMessage = '在线接口开放平台';
  // const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // copyright={`${currentYear} ${defaultMessage}`}
      copyright={`${defaultMessage}`}
      links={[
        // {
        //   key: 'kyapi接口',
        //   title: 'kyapi接口',
        //   href: 'https://pro.ant.design',
        //   blankTarget: true,
        // },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Q-Kyle-Q/kyapi-backend',
          blankTarget: true,
        },
        {
          key: 'kyapi接口',
          title: 'kyapi接口',
          href: 'https://github.com/Q-Kyle-Q/kyapi-backend',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
