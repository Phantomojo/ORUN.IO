import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Spin } from 'antd';
import { 
  ProjectOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  DollarOutlined,
  TrendingUpOutlined
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';

// Components
import ProjectMap from '../../components/Charts/ProjectMap';
import ImpactTrendsChart from '../../components/Charts/ImpactTrendsChart';
import RecentReports from '../../components/Community/RecentReports';
import ProjectStatusChart from '../../components/Charts/ProjectStatusChart';

// Services
import { dashboardService } from '../../services/dashboardService';

// Types
import { DashboardAnalytics } from '../../types/dashboard';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { data: analytics, isLoading, error } = useQuery<DashboardAnalytics>(
    'dashboard-analytics',
    dashboardService.getAnalytics,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">Failed to load dashboard data</Text>
      </div>
    );
  }

  const stats = [
    {
      title: 'Active Projects',
      value: analytics?.total_projects || 0,
      icon: <ProjectOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Community Members',
      value: analytics?.active_communities || 0,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Reports Submitted',
      value: analytics?.total_reports || 0,
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: 'Verified Impacts',
      value: analytics?.verified_impact || 0,
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1',
    },
    {
      title: 'Funding Unlocked',
      value: `$${(analytics?.funding_unlocked || 0).toLocaleString()}`,
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      color: '#13c2c2',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div>
            <Title level={2}>Climate Impact Dashboard</Title>
            <Text type="secondary">
              Real-time monitoring of climate adaptation projects across Africa
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={8} xl={4.8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: '12px',
                      border: `2px solid ${stat.color}20`,
                      background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)`,
                    }}
                  >
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      prefix={stat.icon}
                      valueStyle={{ color: stat.color, fontWeight: 'bold' }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Main Content */}
          <Row gutter={[16, 16]}>
            {/* Project Map */}
            <Col xs={24} lg={16}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card
                  title="Project Locations"
                  extra={<TrendingUpOutlined />}
                  style={{ borderRadius: '12px', height: '400px' }}
                >
                  <ProjectMap />
                </Card>
              </motion.div>
            </Col>

            {/* Project Status */}
            <Col xs={24} lg={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card
                  title="Project Status"
                  style={{ borderRadius: '12px', height: '400px' }}
                >
                  <ProjectStatusChart />
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[16, 16]}>
            {/* Impact Trends */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card
                  title="Impact Trends"
                  style={{ borderRadius: '12px', height: '350px' }}
                >
                  <ImpactTrendsChart />
                </Card>
              </motion.div>
            </Col>

            {/* Recent Reports */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card
                  title="Recent Community Reports"
                  style={{ borderRadius: '12px', height: '350px' }}
                >
                  <RecentReports />
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card
              title="Key Insights"
              style={{ borderRadius: '12px' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }}>
                      📈
                    </div>
                    <Title level={4}>Positive Impact</Title>
                    <Text type="secondary">
                      87% of monitored projects show measurable improvement in resilience indicators
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }}>
                      🌍
                    </div>
                    <Title level={4}>Continental Reach</Title>
                    <Text type="secondary">
                      Active monitoring across 12 countries with 45+ community partnerships
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }}>
                      💰
                    </div>
                    <Title level={4}>Funding Impact</Title>
                    <Text type="secondary">
                      $2.3M in additional funding unlocked through verified impact data
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Space>
      </motion.div>
    </div>
  );
};

export default Dashboard;

