import * as $_ from "lodash";
import * as Yup from "yup";

import {
  ClassicEditor,
  Lucide,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Tippy
} from "@/base-components";
import {
  clearAllImage,
  clearImage,
  addNewContact as onAddNewContact,
  uploadImage
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { LoadingIcon } from "@/base-components";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";

function Main() {
  const dispatch = useDispatch();

  const { loading, urls, posted } = useSelector((state) => state.HelpReducer);

  const [error, setError] = useState(null);

  const [submit, setSubmit] = useState(false);

  const initialValues = {
    title: "",
    content: "",
    caption: "",
    ImagesUrl: []
  };

  const { values, errors, handleSubmit, handleChange, setFieldValue, resetForm } = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      caption: Yup.string().required("Caption is required")
    }),
    onSubmit: (values) => {
      values.ImagesUrl = urls;
      dispatch(onAddNewContact(values));
    }
  });

  // 5 MB
  const maxFileSize = 5242880;

  // ** State
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: maxFileSize,
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg"]
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        if (rejectedFiles.length > 0 && rejectedFiles[0].size > maxFileSize) {
          setError("File size is too large");
        } else {
          setError("File type is not supported");
        }
      } else {
        setError(null);
        if (acceptedFiles.length === 0) {
          return;
        } else if (acceptedFiles.length + files.length > 5) {
          setError("You can only upload a maximum of 5 files");
        } else {
          setFiles([
            ...files,
            ...acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file)
              })
            )
          ]);
        }
      }
    }
  });

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
    setError(null);
    dispatch(clearImage(file.name));
  };

  useEffect(() => {
    if (posted) {
      resetForm();
      setFiles([]);
      dispatch(clearAllImage());
      setSubmit(false);
    }
  }, [posted]);

  useEffect(() => {
    if (
      files &&
      files.length > 0 &&
      files.length <= 5 &&
      !error &&
      !loading &&
      urls.length < files.length
    ) {
      dispatch(uploadImage(files));
    }
  }, [files]);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Contact Us</h2>
      </div>
      <div className="pos intro-y grid grid-cols-12 gap-5 mt-5">
        <div className="intro-y col-span-12 lg:col-span-8">
          <TabGroup className="post intro-y overflow-hidden box mt-5">
            <TabList className="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800">
              <Tab fullWidth={false} className="w-full sm:w-40 py-0 px-0" tag="button">
                <Tippy
                  content="Fill in the article content"
                  className="tooltip w-full flex items-center justify-center py-4"
                  aria-controls="content"
                  aria-selected="true"
                >
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Content
                </Tippy>
              </Tab>
            </TabList>
            <TabPanels className="post__content">
              <TabPanel className="p-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmit(true);
                    handleSubmit();
                    return false;
                  }}
                >
                  <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                    <div className="font-medium flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                      <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Subject
                    </div>

                    <div className="mt-5">
                      <div>
                        <label htmlFor="post-form-7" className="form-label mr-2">
                          Title
                        </label>
                        <input
                          type="text"
                          className="intro-y form-control box mr-2 py-3 px-4 box pr-10"
                          placeholder="Title"
                          value={values.title}
                          name="title"
                          onChange={handleChange}
                        />
                        {submit && errors.title && (
                          <div className="text-red-600 text-xs mt-1">{errors.title}</div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5">
                      <ClassicEditor
                        value={values.content}
                        name="content"
                        onChange={(value) => {
                          setFieldValue("content", value);
                        }}
                      />
                      {submit && errors.content && (
                        <div className="text-red-600 text-xs mt-1">{errors.content}</div>
                      )}
                    </div>
                  </div>
                  <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5 mt-5">
                    <div className="font-medium flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                      <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Caption & Images
                    </div>
                    <div className="mt-5">
                      <div>
                        <label htmlFor="post-form-7" className="form-label mr-2">
                          Caption
                        </label>
                        <input
                          id="post-form-7"
                          type="text"
                          className="form-control"
                          placeholder="Write caption"
                          value={values.caption}
                          name="caption"
                          onChange={handleChange}
                        />
                        {submit && errors.caption && (
                          <div className="text-red-600 text-xs mt-1">{errors.caption}</div>
                        )}
                      </div>
                      <div className="mt-3">
                        <label className="form-label">Upload Image</label>
                        <div className="border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4 pb-4">
                          <div className="flex flex-wrap px-4">
                            {$_.take(files, files.length).map((value, key) => (
                              <div
                                key={key}
                                className="w-24 h-24 relative image-fit mb-5 mr-5 cursor-pointer zoom-in flex flex-col justify-center items-center"
                              >
                                <img className="rounded-md" alt={value.name} src={value.preview} />
                                {loading ? (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <LoadingIcon icon="oval" className="w-5 h-5 rounded-full" />
                                  </div>
                                ) : (
                                  <Tippy
                                    tag="div"
                                    content="Remove this image?"
                                    className="w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 -mr-2 -mt-2"
                                    onClick={() => {
                                      handleRemoveFile(value);
                                    }}
                                  >
                                    <Lucide icon="X" className="w-4 h-4" />
                                  </Tippy>
                                )}
                              </div>
                            ))}

                            {files.length === 0 || files.length > 4 ? (
                              ""
                            ) : (
                              <div className="w-24 h-24 relative image-fit mb-5 mr-5 cursor-pointer zoom-in">
                                <div className="flex flex-col text-center items-center justify-center rounded-md border-dashed border-2 border-theme-1 dark:border-darkmode-400 w-full h-full ">
                                  <div
                                    {...getRootProps({ className: "dropzone" })}
                                    className="w-full h-full p-5 text-center flex flex-col items-center justify-center"
                                  >
                                    <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                                    <input {...getInputProps()} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {files.length > 0 ? (
                            ""
                          ) : (
                            <div {...getRootProps({ className: "dropzone" })}>
                              <input {...getInputProps()} />
                              <div className="w-full h-full p-5 text-center flex flex-col items-center justify-center">
                                <Lucide icon="Upload" className="w-4 h-4 mr-2 mb-4" />
                                <h4 className="text-primary text-md">
                                  <a href="/" onClick={(e) => e.preventDefault()}>
                                    Drop Files here or click to upload
                                  </a>
                                </h4>
                                <span className="text-gray-600 dark:text-darkmode-400">
                                  Maximum file size is 2 MB <br />
                                  Only .jpg, .jpeg & .png files are allowed
                                </span>
                              </div>
                            </div>
                          )}
                          {error && <div className="text-danger text-center">{error}</div>}
                          <span className="text-info mx-7"></span>
                        </div>
                        <button
                          className="intro-y form-control py-4 px-4 btn btn-primary shadow-md my-4 "
                          type="submit"
                          disabled={loading}
                        >
                          <Lucide icon="Send" className="w-4 h-4 mr-2" /> Send
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
}

export default Main;
