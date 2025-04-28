'use client'
import React from 'react'
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import Heading from '../../../app/utils/Heading';
import AdminProtected from '@/app/hooks/adminProtected';
import DashboardHero from '@/app/components/DashboardHero';
import CreateResource from '../../components/Admin/Resource/CreateResource';

const page = () => {
    return (
      <div>
        <AdminProtected>
          <Heading 
            title="ELearning - admin"
            description="ELearning is a platform for students to learn and get help from teachers"
            keywords="Programming,MERN,REDUX,Machine Learning"
          />
          <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
              <AdminSidebar />
            </div>
            <div className="w-[84%] sm:w-[80%]">
              <DashboardHero />
              <div className="min-h-screen bg-gradient-to-r">
        <CreateResource />
      </div>
            </div>
          </div>
        </AdminProtected>
      </div>
    )
  }
  
  export default page