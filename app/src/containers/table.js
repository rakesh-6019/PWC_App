import React from "react";
import PropTypes from "prop-types";
import axios from 'axios';
import {CircularProgress} from '@material-ui/core';
import CustomTable from "../components/CustomTable";

export function Table(props) {

    const [users, setUsers] = React.useState([]);
    React.useEffect(() => {
        axios
            .get('http://localhost:3000/users')
            .then((response) => {
                setUsers(response.data.users);             
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const columns = [
        {
            Header: 'Full Name',
            mapping: 'name',
            filterType: 'autocomplete',
            filterMethod: (filter, rows) => rows.filter((row) => row.name.toLowerCase().includes(filter.value)),
        },
        {
            Header: 'User Name',
            mapping: 'username',
            filterType: 'autocomplete',
            filterMethod: (filter, rows) => rows.filter((row) => row.username.toLowerCase().includes(filter.value)),
        },
        {
            Header: 'Email',
            mapping: 'email',
            filterType: 'autocomplete',
            filterMethod: (filter, rows) =>  rows.filter((row) => row.email.toLowerCase().includes(filter.value)),
        },
        {
            Header: 'Phone Number',
            mapping: 'phone',
            filterType: 'autocomplete',
            filterMethod: (filter, rows) => rows.filter((row) => row.phone.toLowerCase().includes(filter.value)),
        }
    ]

    console.log(users);

    return (
        <div style={{width: '1000px'}}>
        {users.length === 0 ? <CircularProgress /> : (<div>
            <CustomTable
                data={users}
                uniqueKey={(row) => row.id}
                noDataText="no users found!"
                columns={columns}
                showPagination={false}
                enableFilters
                enableSorting
                nonCollapsible
            />
        </div>)}
        </div>
    )
}