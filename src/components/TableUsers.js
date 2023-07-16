import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/userService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalConfirm from './ModalConfirm';
import _, { debounce, result } from 'lodash';
import './TableUsers.scss';
import { CSVLink } from "react-csv";
import Papa from 'papaparse'
import { toast } from 'react-toastify';

const TableUsers = (props) => {

    const [listUsers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModalAddNew, setIsShowModal] = useState(false);
    const [isEditUser, setIsEditUser] = useState(false);
    const [dataUserEdit, setdataUserEdit] = useState([]);

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState([]);

    const [sortBy, setSortBy] = useState('asc');
    const [sortField, setSortField] = useState('id');

    const [dataExport, setdataExport] = useState([]);

    const handleClose = () => {
        setIsShowModal(false);
        setIsShowModalDelete(false);
    }

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUsers]);
    }

    const handleEditUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers);
        let index = listUsers.findIndex(item => item.id === user.id);
        cloneListUsers[index].first_name = user.first_name;
        setListUsers(cloneListUsers);
    }

    useEffect(() => {
        getUsers(1);
    }, [])

    const getUsers = async (page) => {
        let res = await fetchAllUser(page);

        if (res && res.data) {
            setListUsers(res.data);
            setTotalUsers(res.total);
            setTotalPages(res.total_pages)
        }
    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1)
    }

    const handleEditUser = (user) => {
        if (user) {
            setdataUserEdit(user);
        }
        setIsShowModal(true);
        setIsEditUser(true);
    }

    const openModalAdd = () => {
        setIsShowModal(true);
        setIsEditUser(false);
    }

    const handleDeleteUser = (user) => {
        if (user) {
            setDataUserDelete(user);
        }
        setIsShowModalDelete(true);
        console.log('delete', user);
    }

    const handleDeleteUserFormModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = cloneListUsers.filter(item => item.id !== user.id);
        setListUsers(cloneListUsers);
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUsers(cloneListUsers);
    }

    const handleSearch = debounce((event) => {
        let term = event.target.value;
        if (term) {
            let cloneListUsers = _.cloneDeep(listUsers);
            cloneListUsers = _.filter(cloneListUsers, (item) => {
                return item.email.toLowerCase().includes(term.toLowerCase());
            })
            console.log(term);
            setListUsers(cloneListUsers);
        } else {
            getUsers(1);
        }
    }, 300)

    const getUsersExport = (event, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(["Id", "Email", "First Name", "Last Name"]);
            listUsers.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.first_name;
                arr[3] = item.last_name;
                result.push(arr);
            })
        }
        setdataExport(result);
        done();
    }

    const handleImportCsv = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            if (file.type !== 'text/csv') {
                toast.error('Only accept csv file');
                return;
            }
            Papa.parse(file, {
                complete: function (results) {
                    let rawCSV = result.data
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 3) {
                            if (rawCSV[0][0] !== 'email' ||
                                rawCSV[0][1] !== 'first_name' ||
                                rawCSV[0][2] !== 'last_name') {
                                toast.error('Wrong format header csv file')
                            } else {
                                let result = [];
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = [];
                                        obj.email = item[0];
                                        obj.first_name = item[1];
                                        obj.last_name = item[2];
                                        result.push(obj)
                                    }
                                })
                                setListUsers(result)
                            }
                        } else {
                            toast.error('Wrong format csv file')
                        }
                    } else {
                        toast.error('Not found data on csv file')
                    }
                }

            })
        }

    }

    return (
        <>
            <div className='my-3 add-new d-sm-flex'>
                <span>List Users:</span>
                <div className='group-btns mt-sm-0 mt-2'>
                    <label className='btn btn-warning' htmlFor='test'>
                        <i className='fa-solid fa-file-import'></i>
                        Import
                    </label>
                    <input id='test' type='file' hidden
                        onChange={(event) => handleImportCsv(event)}
                    />
                    <CSVLink
                        filename={"users.csv"}
                        className="btn btn-primary"
                        data={dataExport}
                        asyncOnClick={true}
                        onClick={getUsersExport}>
                        <i className='fa-solid fa-file-arrow-down'></i>
                        Export csv
                    </CSVLink>
                    <button onClick={() => openModalAdd()} className='btn btn-success'>
                        Add user
                    </button>
                </div>

            </div>

            <div className='col-12 col-sm-4 my-3'>
                <input
                    type='text'
                    placeholder='Search user by email...'
                    onChange={(event) => handleSearch(event)} />
            </div>

            <div className='customize-table'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className='sort-header'>
                                    <span>ID</span>
                                    <span>
                                        <i
                                            className="fa-solid fa-arrow-down-long"
                                            onClick={() => handleSort('desc', 'id')}></i>
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() => handleSort('asc', 'id')}></i>
                                    </span>
                                </div>

                            </th>
                            <th>Email</th>
                            <th>
                                <div className='sort-header'>
                                    <span>Fisrt Name</span>
                                    <span>
                                        <i
                                            className="fa-solid fa-arrow-down-long"
                                            onClick={() => handleSort('desc', 'first_name')}></i>
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() => handleSort('asc', 'first_name')}></i>
                                    </span>
                                </div>

                            </th>
                            <th>Last Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsers && listUsers.length > 0 &&
                            listUsers.map((item, index) => {
                                return (
                                    <tr key={`users-${index}`}>
                                        <td>{item.id}</td>
                                        <td>{item.email}</td>
                                        <td>{item.first_name}</td>
                                        <td>{item.last_name}</td>
                                        <td>
                                            <button onClick={() => handleEditUser(item)} className='btn btn-warning mx-3'>Edit</button>
                                            <button onClick={() => handleDeleteUser(item)} className='btn btn-danger'>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>

            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                activeClassName='active'
                className='pagination'
            />

            <ModalAddNew
                isEditUser={isEditUser}
                dataUserEdit={dataUserEdit}
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
                handleEditUserFromModal={handleEditUserFromModal} />

            <ModalConfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteUserFormModal={handleDeleteUserFormModal} />
        </>
    )
}

export default TableUsers;





