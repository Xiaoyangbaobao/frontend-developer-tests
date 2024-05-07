import React, { useEffect, useState } from 'react';

type User = {
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    },
    location: {
        street: {
            number: number,
            name: string
        }
        city: string,
        state: string,
        country: string,
        postcode: number,
        coordinates: {
            latitude: string,
            longitude: string
        },
        timezone: {
            offset: string,
            description: string
        }
    },
    email: string,
    login: {
        uuid: string,
        username: string,
        password: string,
        salt: string,
        md5: string,
        sha1: string,
        sha256: string
    },
    dob: {
        date: string,
        age: number
    },
    registered: {
        date: string,
        age: number
    },
    phone: string,
    cell: string,
    id: {
        name: string,
        value: string
    },
    picture: {
        large: string,
        medium: string,
        thumbnail: string
    },
    nat: string
}

type Country = {
    [key: string]: {
        users: number,
        userList: User[]}
}
function CountryList() {
    const [countries, setCountries] = useState<Country>();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [users, setUsers] = useState([]);
    const [genderFilter, setGenderFilter] = useState('All');
    useEffect(() => {
        fetch('https://randomuser.me/api/?results=100').then(item => {
            item.json().then(i => {
                setUsers(i.results);
                getCountryList(i.results);
            });
        })
    }, []);

    const handleCountryClick = (country: string) => {
        setSelectedCountry(selectedCountry === country ? "" : country);
      };

    const getCountryList = (userList: User[]) => {
        let result:Country = {};
        userList.forEach((user: User) => {
            if (result[user.location.country]) {
                result = { ...result, [user.location.country]: {users: result[user.location.country].users + 1, 
                userList: [...result[user.location.country].userList, user]} }
            } else {
                result = { ...result, [user.location.country]: {users: 1, userList: [user]} }
            }
        });
        setCountries(result);
    }
    
    return (
        <div className='container'>
            <select 
            className='dropdown'
            value={genderFilter}
            onChange={(e) => {
                setGenderFilter(e.target.value);
                if (e.target.value === "All") {
                    getCountryList(users);
                    return;
                }
                getCountryList(users.filter((user: User) => user.gender.toUpperCase() === e.target.value.toUpperCase() ))
                    
            }}>
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            {countries &&Object.keys(countries).map((countryData) => {
                return (
                <div key={countryData}>
                    <h2 className='country-header' onClick={() => handleCountryClick(countryData)}>
                        {countryData} ({countries[countryData].users})
                    </h2>
                    {selectedCountry === countryData && (
                        <ul className='user-list'>
                            {countries[selectedCountry].userList
                                .sort((a, b) => new Date(b.registered.date).getTime() - new Date(a.registered.date).getTime())
                                .map((user: User) => (
                                <li key={user.login.sha256} className='user-item'>
                                    {user.name.title}.{user.name.first} {user.name.last}, {user.gender}, Location: {user.location.street.number} {user.location.street.name} {user.location.state},{user.location.city}, Registered: {new Date(user.registered.date).getDate()}/{new Date(user.registered.date).getMonth() + 1}/{new Date(user.registered.date).getFullYear()}
                                </li>
                                ))
                            }
                        </ul>
                    )}
                </div>
            )})
                
            }
        </div>
    )
}

export default CountryList