import React from "react";
import axios from 'axios';
import {CircularProgress} from '@material-ui/core';
import CustomTable from "../components/CustomTable";
import { UserDetails } from "./userDetails";

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

    return (
        <div style={{width: '1000px', marginTop: '2rem'}}>
        {users.length === 0 ? <CircularProgress color="success" /> : (<div>
            <CustomTable
                data={users}
                uniqueKey={(row) => row.id}
                noDataText="No users found!"
                columns={columns}
                showPagination
                defaultPaginationRows={10}
                paginationRowOptions={[5,10,25,100]}
                enableFilters
                enableSorting
                defaultSorted={{
                    id: 'name',
                    order: 'asc',
                }}
                SubComponent={(row) => <UserDetails address={row.address} company={row.company} /> }
                maxTableHeight={400}
            />
        </div>)}
        </div>
    )
}