import React from 'react';
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from '../../../../app/utils/Heading';
import DashboardHeader from '../../../../app/components/DashboardHeader';
import EditResource from '../../../components/Admin/Customization/EditResource';

const Page = ({ params }) => {
  const id = params?.id;

  return (
    <div>
      <Heading 
        title="ELearning - admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,REDUX,Machine Learning"
      />
      <div className="flex">
        <div className="150opx:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <EditResource id={id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
