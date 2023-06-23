import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../Sidebar';
import HomeTags from '../HomeTags';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { BsPlus } from 'react-icons/bs';
import { ThemeContext } from '../Context/ThemeContext';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import Loading from '../Loading'
const FooterAdd = () => {
    const navigate = useNavigate();
    const { user } = useAuth0()
    const { theme } = useContext(ThemeContext);
    const [footer, setFooter] = useState(null)
    const [newslatter,setNewsLatter]=useState(null)
    const [showModal, setShowModal] = useState(false);
    const [update,setUpdate]=useState('');
    const [showEditModel,setShowEditModal]=useState(false)
    const [loading, setLoading] = useState(true);
    
    const getFooter = async () => {
        const res = await axios.get(`https://vercel-notion.vercel.app/usersdata/${window.location.hostname}`)
        console.log("fd", res.data.footerData);
        setFooter([res.data.footerData]);
        setNewsLatter([res.data.footerNewsData]);
        setLoading(false); 
    }
    useEffect(() => {
        getFooter()
    }, [])
    const path = window.location.pathname;
    const pathParts = path.split('/');
    const lastName = pathParts[pathParts.length - 1];

    const form1=useForm()
    const {register:register1,handleSubmit:handleSubmit1,formState:{errors:error1}}=form1;

  
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const onSubmit1 = async(data) => {
        const body={
        NewsLetterName:data.NewsLetterName,
        NewsLetterText:data.NewsLetterText,
        CopyWrite:data.CopyWrite
        }
     await axios.post(`https://vercel-notion.vercel.app/FooterNewsLatterInsert/${newslatter && newslatter[0].id}`, body)
      .then((res) => {
        alert("register user successfully")
        console.log(res);
      }).catch((err) => {
        console.log(err);
      })
       
    };
    const onSubmit = () => {

    };
    const selectedOption = watch('linkType');
    const handleCancel = () => {
        reset();
    }
    const handleClose = () => {

    }
    
    const handleClickOpen=(list)=>{
        console.log("update data",list);
          setUpdate(list)
          setShowEditModal(true)
        
        }

        const handleDelete = async (id) => {
            console.log(id);
            const confirm = window.confirm(
              `Are you sure you want to delete User "${id}"?`
            );
            if (confirm && id) {
              await axios.delete(`http://localhost:5000/deleteTemplateRecord/${id}/${user.name}`,
                {
                  headers: {
                    authorization: `bearer ${JSON.parse(sessionStorage.getItem('token'))}`
                  }
                })
                .then((res) => {
                  console.log(res);
                  if (res.status === 200) {
                    // getAll()
                    alert("record deleted success")
        
                  }
                })
                .catch((err) => {
                  alert(err)
                })
            }
          }
    
  
    return (
        <div className='min-h-[calc(100vh-65px-100px)] w-full flex'>
            <Sidebar />
            <>
            {loading ? <Loading />:
                <div className='sm:p-10 p-2 bg-gray-50  w-full justify-between'>
                  <form method='post' onSubmit={handleSubmit1(onSubmit1)}>
                    <HomeTags name={lastName} />
                    <hr />
                    <div className='my-5'>
                        <div className='gap-2 flex flex-col'>
                            <p>NewsLetter</p>
                            <p className='text-gray-400'> collect emails from your visitors. </p>
                        </div>
                        {newslatter?.map((item,i)=>{
                            return(
                            <div key={item.i}>
                            <div  className='mt-2 gap-2 flex flex-col'>
                            <label>Headline</label>
                            <input className=' p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1' defaultValue={item?.properties.NewsLetterName.title[0].plain_text} 
                            id="NewsLetterName"
                           {...register1('NewsLetterName',{required:true})}
                            placeholder="Enter News Letter-Name" />
                            {error1.NewsLetterName &&(
                                <p className='text-red-500'>NewsLetter Name is required</p>
                            )}
                        </div>
                        <div className=' gap-2 flex flex-col'>
                            <label>Text</label>
                            <input className=' p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1' 
                            defaultValue={item?.properties.NewsLetterText.rich_text[0].plain_text} placeholder="" 
                            id="NewsLetterText"
                            {...register1('NewsLetterText',{required:true})}
                            />
                             {error1.NewsLetterText &&(
                                <p className='text-red-500'>NewsLetter Text is required</p>
                            )}
                        </div>

                        </div>
                        )
                      })}
                    </div>
                    <div className='my-5'>
                        <div className='gap-2 flex flex-col'>
                            <p>Footer</p>
                            <p className='text-gray-400'>create group of links to display in footer.</p>
                        </div>
                        <hr className='lg:w-1/2  border-2 mt-2' />
                        {footer?.map((item,i)=>{
                        return(
                            <>
                        {item?.properties?.FooterName ? (<>
                            <div className='flex  justify-between lg:w-1/2 p-5 outline outline-1 my-5 rounded items-center' >
                                <div>
                                    
                                <label>{item?.properties.FooterName.title[0].plain_text}</label>
                                </div>
                                <div className='flex justify-around gap-5'>
                                    <p className='bg-gray-400 rounded p-1'>{item?.properties.FooterLinkType.select.name}</p>
                                   
                                    <button

                                        onClick={() => {
                                        handleClickOpen(item)
                                        }}
                                    >
                                        <FiEdit className="text-green-600 w-4 h-4" />
                                    </button>

                                    <button

                                        onClick={() => {

                                        handleDelete(item.id);

                                        }}
                                    >
                                        <FiTrash2 className="text-red-600 w-4 h-4" />
                                    </button>
                                   
                                </div>
                                
                            </div>
                        </>)
                            : (
                                <>
                                    <div className='flex mt-5 bg-gray-200 hover:bg-gray-300 items-center gap-3  outline outline-1 active:outline-0  w-fit p-2 rounded-md cursor-pointer text-gray-400 hover:text-gray-700'
                                        onClick={() => { setShowModal(!showModal) }}
                                    >
                                        <BsPlus className='text-2xl ' />
                                        <span className=''> Add new Link</span>
                                    </div>
                                </>
                            )}
                            </>
                        )})}
                    </div>
                    <div className='my-5'>
                        <h1>CopyRight</h1>
                        your website copyright notice. This will be added at the bootom of your website.
                        {newslatter?.map((item)=>{
                            return(
                           <> 
                            <div className='my-5 flex flex-col gap-2'>
                            <label>copyright Notice</label>
                            <input className=' p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1'
                             defaultValue={item.properties.CopyWrite.rich_text[0].plain_text} placeholder="" 
                             {...register1("CopyWrite",{required:true})}
                             id="CopyWrite"
                             />
                             {error1.CopyWrite &&(
                                 <p className='text-red-500'>Copywrite is required</p>
                              )}
                        </div>
                        </>)
                        })
                        }
                    </div>
                    <hr />
                    <div className='gap-5 w-full justify-end items-end mt-5 flex px-5'>
                        <button className='p-2 rounded bg-gray-400 outline outline-2 active:outline-1 px-5' type="submit">save</button>
                        <button className='p-2 rounded bg-gray-400 outline outline-2 active:outline-1 px-5' onClick={() => navigate('/settings')}>cancel</button>
                    </div>
                </form>
                </div>
                }
                {showModal ? (
                    <div className='z-10 absolute justify-center items-center flex w-full min-h-[calc(100vh-65px-100px)] backdrop-brightness-50'>
                        <div onClose={() => setShowModal(false)} className={`lg:w-[50%] p-5 rounded-md ${theme === 'dark' ? ' bg-gray-600' : 'bg-gray-200'}`}  >
                            <div className='flex md:p-4 w-full justify-between items-center'>
                                <p className='text-2xl  rounded-full hover:border-gray-800  cursor-pointer w-fit' onClick={() => setShowModal(!showModal)}> <AiFillCloseCircle />
                                </p>
                                <h3 className="sm:text-3xl font-semibold">Add New Link</h3>
                            </div>

                            <div className='flex flex-col gap-2'>

                                <p>Footer Link details</p>
                                <p>add a link for easy navigation.</p>
                                <form onSubmit={handleSubmit(onSubmit)} className=''>
                                    <div className=' flex flex-col gap-2 mt-2'>
                                        <label>Name <span className='text-red-500'>*</span></label>
                                        <input className={` p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1 focus:outline-gray-500 
                    ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}`} placeholder="" />
                                    </div>
                                    <div className='flex flex-col gap-2 mt-2'>
                                        <label>Sort Description</label>
                                        <input className={`p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1 focus:outline-gray-500 
                    ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}
                    `} placeholder="" />
                                    </div>
                                    <div className="my-3 sm:my-0 w-full lg:w-1/2 ">
                                        <label
                                            className={`${theme === 'dark' ? 'text-white' : 'text-black'} flex text-start text-sm md:text-right mb-0 md:mb-0 pr-4 2xl:text-lg mt-2`}
                                        >
                                            Link Type <span className='text-red-500'>*</span>
                                        </label>
                                        <select
                                            className={`appearance-none border border-gray-200 rounded w-full sm:text-md text-sm p-1.5 leading-8 focus:outline-1px focus:outline-gray-500 
                          ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}`}
                                            id="ready"
                                            {...register('linkType', { required: true })}
                                        //   {...register('ready', { required: true })}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="pending">Pending</option>
                                            <option value="done">Done</option>
                                        </select>
                                        {errors.linkType && <span className='text-red-500'>This field is required</span>}
                                        {/* {errors.ready && (
                          <p className="text-red-500">Notion contents ready to publish required.</p>
                        )} */}
                                    </div>
                                    {selectedOption ? (
                                        <>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label>{selectedOption}</label>
                                                <input className={`p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1 focus:outline-gray-500 
                        ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}
                        `} placeholder=""
                                                    {...register(`${selectedOption}`, { required: true })}
                                                />
                                                {errors.selectedOption && <span>This field is required</span>}
                                            </div>
                                        </>) : ''}
                                    <hr />
                                    <div className='gap-5 w-full justify-end items-end mt-5 flex px-5'>
                                        <button className='p-2 rounded bg-gray-400 outline outline-2 active:outline-1 px-5' type='submit'>save</button>
                                        <button className='p-2 rounded bg-gray-400 outline outline-2 active:outline-1 px-5' onClick={handleCancel}>cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                ) : (<></>)}
                {showEditModel?(
                
                <>
                    <div className='z-10 absolute justify-center items-center flex w-full min-h-[calc(100vh-110px)] backdrop-brightness-50'>
                        <div onClose={() => setShowModal(false)} className={`lg:w-[50%] p-5 rounded-md ${theme === 'dark' ? ' bg-gray-600' : 'bg-gray-200'}`}  >
                            <div className='flex md:p-4 w-full justify-between items-center'>
                                <p className='text-2xl  rounded-full hover:border-gray-800  cursor-pointer w-fit' onClick={() => setShowEditModal(!showEditModel)}> <AiFillCloseCircle />
                                </p>
                                <h3 className="sm:text-3xl font-semibold">Edit Link</h3>
                            </div>

                            <div className='flex flex-col gap-2'>

                                <p>Footer Link details</p>
                                <p>add a link for easy navigation.</p>
                                <form onSubmit={handleSubmit(onSubmit)} className=''>
                                    <div className=' flex flex-col gap-2 mt-2'>
                                        <label>Name <span className='text-red-500'>*</span></label>
                                        <input className={` p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1 focus:outline-gray-500 
                    ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}`} placeholder="" defaultValue={update?.properties.FooterName.title[0].plain_text}/>
                                    </div>
                                    <div className='flex flex-col gap-2 mt-2'>
                                        <label>Sort Description</label>
                                        <input className={`p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1 focus:outline-gray-500 
                    ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}
                    `} placeholder="" defaultValue={update.properties.FooterDesc.rich_text[0].plain_text}/>
                                    </div>
                                    <div className="my-3 sm:my-0 w-full lg:w-1/2 ">
                                        <label
                                            className={`${theme === 'dark' ? 'text-white' : 'text-black'} flex text-start text-sm md:text-right mb-0 md:mb-0 pr-4 2xl:text-lg mt-2`}
                                        >
                                            Link Type <span className='text-red-500'>*</span>
                                        </label>
                                        <select
                                            className={`appearance-none border border-gray-200 rounded w-full sm:text-md text-sm p-1.5 leading-8 focus:outline-1px focus:outline-gray-500 
                                             ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}`}
                                            id="ready"
                                            defaultValue={update.properties.FooterLinkType.select.name}
                                            {...register('linkType', { required: true })}
                                        //   {...register('ready', { required: true })}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="pending" selected={update.properties.FooterLinkType.select.name ==='pending'}>Pending</option>
                                            <option value="External_Link" selected={update.properties.FooterLinkType.select.name === 'External_Link'}>External_Link </option>
                                        </select>
                                        {errors.linkType && <span className='text-red-500'>This field is required</span>}
                                        {/* {errors.ready && (
                          <p className="text-red-500">Notion contents ready to publish required.</p>
                        )} */}
                                    </div>
                                    {selectedOption ? (
                                        <>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label>{selectedOption}</label>
                                                <input className={`p-2 lg:w-1/2 focus:outline border rounded-md focus:outline-1 focus:outline-gray-500 
                        ${theme === 'dark' ? 'text-white bg-gray-500' : 'text-gray-900 bg-gray-100'}
                        `} placeholder=""
                                        defaultValue={update.properties.FooterLink.url}
                                                    {...register(`${selectedOption}`, { required: true })}
                                                />
                                                {errors.selectedOption && <span>This field is required</span>}
                                            </div>
                                        </>) : ''}
                                    <hr />
                                    <div className='gap-5 w-full justify-end items-end mt-5 flex px-5'>
                                        <button className='p-2 rounded bg-gray-400 outline outline-2 active:outline-1 px-5' type='submit'>save</button>
                                        <button className='p-2 rounded bg-gray-400 outline outline-2 active:outline-1 px-5' onClick={()=>setShowEditModal(!showEditModel)}>cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
                ):(<></>)}
            </>
        </div>
    )
}

export default FooterAdd;