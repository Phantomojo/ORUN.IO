import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, Typography, Spin } from 'antd';
import { 
  EnvironmentOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  TrophyOutlined,
  LineChartOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const { Title, Text } = Typography;

// API base URL
const API_BASE = 'http://localhost:8000';

interface Project {
  id: number;
  name: string;
  location: string;
  country: string;
  project_type: string;
  start_date: string;
  status: string;
  resilience_score: number;
  beneficiaries: number;
  funding_amount: number;
  funding_source: string;
}

interface Analytics {
  total_projects: number;
  total_beneficiaries: number;
  total_funding: number;
  average_resilience_score: number;
  active_projects: number;
  countries_covered: number;
  project_types: string[];
}

interface SatelliteData {
  project_id: number;
  date: string;
  ndvi: number;
  ndwi: number;
  evi: number;
  cloud_cover: number;
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE}/projects`),
        axios.get(`${API_BASE}/analytics`)
      ]);
      
      setProjects(projectsRes.data);
      setAnalytics(analyticsRes.data);
      
      // Select first project by default
      if (projectsRes.data.length > 0) {
        setSelectedProject(projectsRes.data[0]);
        fetchSatelliteData(projectsRes.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSatelliteData = async (projectId: number) => {
    try {
      const response = await axios.get(`${API_BASE}/satellite/${projectId}`);
      setSatelliteData(response.data);
    } catch (error) {
      console.error('Error fetching satellite data:', error);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    fetchSatelliteData(project.id);
  };

  const projectColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <Button type="link" onClick={() => handleProjectSelect(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Type',
      dataIndex: 'project_type',
      key: 'project_type',
    },
    {
      title: 'Resilience Score',
      dataIndex: 'resilience_score',
      key: 'resilience_score',
      render: (score: number) => (
        <span style={{ color: score > 80 ? '#52c41a' : score > 60 ? '#faad14' : '#ff4d4f' }}>
          {score}%
        </span>
      ),
    },
    {
      title: 'Beneficiaries',
      dataIndex: 'beneficiaries',
      key: 'beneficiaries',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: 'Funding',
      dataIndex: 'funding_amount',
      key: 'funding_amount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
  ];

  const satelliteColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'NDVI',
      dataIndex: 'ndvi',
      key: 'ndvi',
      render: (value: number) => value.toFixed(4),
    },
    {
      title: 'NDWI',
      dataIndex: 'ndwi',
      key: 'ndwi',
      render: (value: number) => value.toFixed(4),
    },
    {
      title: 'EVI',
      dataIndex: 'evi',
      key: 'evi',
      render: (value: number) => value.toFixed(4),
    },
    {
      title: 'Cloud Cover',
      dataIndex: 'cloud_cover',
      key: 'cloud_cover',
      render: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2a2a2a 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-content">
          <Title level={1} className="logo">
            <GlobalOutlined /> ORUN.IO
          </Title>
          <Text className="tagline">Climate Impact Verification Platform for Africa</Text>
        </div>
      </div>

      <div className="container">
        {/* Analytics Dashboard */}
        {analytics && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Projects"
                  value={analytics.total_projects}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#00d4ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Beneficiaries"
                  value={analytics.total_beneficiaries}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  formatter={(value) => value?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Funding"
                  value={analytics.total_funding}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                  formatter={(value) => `$${value?.toLocaleString()}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Avg Resilience Score"
                  value={analytics.average_resilience_score}
                  suffix="%"
                  prefix={<LineChartOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Projects Table */}
        <Card title="Climate Adaptation Projects" className="main-card">
          <Table
            dataSource={projects}
            columns={projectColumns}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>

        {/* Selected Project Details */}
        {selectedProject && (
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card title={`${selectedProject.name} - Details`} className="main-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Location: </Text>
                    <Text><EnvironmentOutlined /> {selectedProject.location}</Text>
                  </div>
                  <div>
                    <Text strong>Project Type: </Text>
                    <Text>{selectedProject.project_type}</Text>
                  </div>
                  <div>
                    <Text strong>Funding Source: </Text>
                    <Text>{selectedProject.funding_source}</Text>
                  </div>
                  <div>
                    <Text strong>Start Date: </Text>
                    <Text>{selectedProject.start_date}</Text>
                  </div>
                  <div>
                    <Text strong>Status: </Text>
                    <Text style={{ 
                      color: selectedProject.status === 'Active' ? '#52c41a' : '#ff4d4f' 
                    }}>
                      {selectedProject.status}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Project Metrics" className="main-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Resilience Score"
                      value={selectedProject.resilience_score}
                      suffix="%"
                      valueStyle={{ 
                        color: selectedProject.resilience_score > 80 ? '#52c41a' : 
                               selectedProject.resilience_score > 60 ? '#faad14' : '#ff4d4f' 
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Beneficiaries"
                      value={selectedProject.beneficiaries}
                      formatter={(value) => value?.toLocaleString()}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Funding Amount"
                      value={selectedProject.funding_amount}
                      formatter={(value) => `$${value?.toLocaleString()}`}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Cost per Beneficiary"
                      value={selectedProject.funding_amount / selectedProject.beneficiaries}
                      formatter={(value) => `$${value?.toFixed(0)}`}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {/* Satellite Data */}
        {satelliteData.length > 0 && (
          <Card title="Satellite Data Analysis" className="main-card" style={{ marginTop: 24 }}>
            <Table
              dataSource={satelliteData.slice(0, 10)} // Show last 10 data points
              columns={satelliteColumns}
              rowKey="date"
              pagination={false}
              size="small"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Text type="secondary">
                Showing latest 10 satellite observations for {selectedProject?.name}
              </Text>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
