import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import Loader from "../../Loader/Loader";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { styles } from "@/app/styles/style";
import { useDeleteResourceMutation, useGetAllResourcesQuery } from "@/redux/features/resources/resourceApi";
import Image from 'next/image'; // Import Image for better performance

const AllResource = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [resourceId, setResourceId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoading, data, refetch, error } = useGetAllResourcesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deleteResource, { isSuccess, error: deleteError }] = useDeleteResourceMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setOpen(false);
      toast.success("Resource Deleted Successfully");
    }
    if (deleteError) {
      toast.error("Failed to delete resource. Please try again.");
    }
  }, [isSuccess, deleteError, refetch]);

  const handleDelete = async () => {
    await deleteResource(resourceId);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.3 },
    { field: "title", headerName: "Title", flex: 0.4 },
    { field: "category", headerName: "Category", flex: 0.3 },
    { field: "description", headerName: "Description", flex: 0.5 },
    {
      field: "thumbnail",
      headerName: "Thumbnail",
      flex: 0.3,
      renderCell: (params) => (
        <Image
          src={params.value}
          alt="Thumbnail"
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
      ),
    },
    {
      field: "pdf",
      headerName: "PDF",
      flex: 0.3,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View PDF
        </a>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params) => (
        <Link href={`/admin/edit-resource/${params.row._id}`}>
          <FiEdit2 className="dark:text-white text-black cursor-pointer" size={20} />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setOpen(true);
            setResourceId(params.row._id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" size={20} />
        </Button>
      ),
    },
  ];

  const rows =
    data?.filter((item) =>
      [item.name, item.title, item.category, item.description]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ).map((item, index) => ({
      _id: item._id,
      id: `RE-${index + 1}`,
      name: item.name || "Unknown",
      title: item.title || "No Title",
      category: item.category || "Uncategorized",
      description: item.description || "No Description",
    })) || [];

  const getBase64ImageFromURL = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    const imageUrl =
      "https://th.bing.com/th/id/OIP.P1tCh-O3o_SWiGxh2NgxAgHaDQ?rs=1&pid=ImgDetMain";

    try {
      const logoBase64 = await getBase64ImageFromURL(imageUrl);
      doc.addImage(logoBase64, "PNG", 15, 10, 40, 20);
    } catch (error) {
      console.error("Error loading image:", error);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RESOURCE INVOICE", 125, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Resource Details #: INV-20240318`, 140, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 38);

    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CEO ELearning:", 15, 55);
    doc.setFont("helvetica", "normal");
    doc.text("Anuja Manthrirathne", 15, 63);
    doc.text("456, Pussella, Rathnapura, Sri Lanka", 15, 70);
    doc.text("Phone: 0772029251 | Email: Anuja@example.com", 15, 78);

    doc.setFont("helvetica", "bold");
    doc.text("ELearning Pvt Ltd", 120, 55);
    doc.setFont("helvetica", "normal");
    doc.text("123, Main Street, Colombo, Sri Lanka", 120, 63);
    doc.text("Phone: 0772029251", 120, 70);
    doc.text("Email: contact@elearning.com", 120, 78);

    autoTable(doc, {
      startY: 90,
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        valign: "middle",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
        4: { cellWidth: 45 },
        5: { cellWidth: 45 },
      },
      head: [["ID", "Name", "Title", "Category"]],
      body: rows.map((row) => [
        row.id,
        row.name,
        row.title,
        row.category,
      ]),
      theme: "grid",
    });

    const finalY = doc.internal.pageSize.height - 50;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Users:", 140, finalY);
    doc.text(`${rows.length}`, 180, finalY);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for your business!", 15, 280);
    doc.text("For inquiries, contact support@elearning.com", 15, 285);

    const pageCount = doc.internal.getNumberOfPages() || 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    doc.save("Resource.pdf");
  };

  return (
    <div className="mt-[120px]">
      <Box m="20px">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">Failed to load resources. Please try again.</p>
        ) : (
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396 !important" : "#A4A9FC",
                color: "#9b4dca",
                borderBottom: "none",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom: theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc !important",
              },
            }}
          >
            <div className="w-full flex justify-end">
              <button
                className={`${styles.button} !w-[200px] dark:bg-[#282963] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                onClick={generatePDF}
              >
                Download PDF Report
              </button>
            </div>
            <div className="w-full flex justify-start mb-4">
              <input
                type="text"
                placeholder="Search by Name or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px] px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
               placeholder-gray-500 dark:placeholder-gray-400 
               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
               ml-4"
              />
            </div>
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        )}

        {open && (
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg w-[90%] max-w-[400px] bg-white dark:bg-gray-800">
              <h1 className={`${styles.title} mb-6 text-center`}>
                Are you sure you want to delete this Resource?
              </h1>
              <div className="flex w-full items-center justify-between mt-8">
                <div
                  className={`${styles.button} !w-[120px] h-[40px] bg-[#57c7a3] hover:bg-[#45a98c] text-white rounded-md cursor-pointer`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </div>
                <div
                  className={`${styles.button} !w-[120px] h-[40px] bg-[#d63f3f] hover:bg-[#b83232] text-white rounded-md cursor-pointer`}
                  onClick={handleDelete}
                >
                  Delete
                </div>
              </div>
            </Box>
          </Modal>
        )}
      </Box>
    </div>
  );
};

export default AllResource;
