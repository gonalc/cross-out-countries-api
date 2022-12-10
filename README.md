# Yanapak API

In order to start this project, run the following commands:

- Only the first time, to install the dependencies:

```sh
yarn install
```

- To run it in **dev** mode:

```sh
yarn dev
```

- To run it in **production** mode:

```sh
yarn start
```

- To run the tests. This command will be automatically triggered on each commit:

```sh
yarn test
```

#### Table of contents

- [ENV Variables](#env-variables)

- [Population](#population)

- [Pagination](#pagination)

- [Query filters](#query-filters)

## ENV Variables

Add variables to the `.env` file:

| Variable    | Mandatory | Example          |
| ----------- | --------- | ---------------- |
| APP_NAME    | Yes       | 'Yanapak Server' |
| APP_VERSION | Yes       | '1.0.0'          |
| PORT        | No        | 8080             |
| DB_PORT     | Yes       | 3306             |
| DB_CLIENT   | No        | 'mysql'          |
| DB_HOST     | Yes       | '127.0.0.1'      |
| DB_USER     | Yes       | 'root'           |
| DB_PASSWORD | Yes       | 'yourPassword'   |
| DB_NAME     | Yes       | 'database'       |

## Population

You can populate fields that are declared in the model by sending `include` as a param in the URL.

By doing a `GET` to the API like this:

```
api/venues/1?include=user
```

You would get a response like this:

```json
{
  "data": {
    "id": 1,
    "name": "First venue _EDITED_",
    "defaultTax": 21,
    "createdAt": "2022-10-13T12:35:52.000Z",
    "updatedAt": "2022-10-30T11:45:15.000Z",
    "user": {
      "id": 2,
      "email": "test+2_edited_included@email.com",
      "password": "Prueba23",
      "venueId": 1,
      "createdAt": "2022-10-13T12:37:13.000Z",
      "updatedAt": "2022-11-04T18:06:50.000Z"
    }
  }
}
```

This is applied to these generic endpoints:

- Get All

- Get Single

- Update

## Pagination

You can get the results from the DB grouped in pages. This is useful for the UI so it only handles the needed amount of data.

You can get the results like that by hitting the `/paged` endpoint, like so:

```
/api/venues/paged?pagination[offset]=0&pagination[limit]=4
```

That query will return the firsts result that matches the query, but only 4 results. The total amount of results will also be returned under the `rows` field, like so:

```json
{
  "data": {
    "count": 10,
    "rows": [
      {
        "id": 97,
        "name": "TEST__Venue",
        "defaultTax": 14,
        "createdAt": "2022-11-04T18:25:17.000Z",
        "updatedAt": "2022-11-04T18:25:17.000Z"
      },
      {
        "id": 99,
        "name": "TEST__Venue",
        "defaultTax": 14,
        "createdAt": "2022-11-04T18:26:55.000Z",
        "updatedAt": "2022-11-04T18:26:55.000Z"
      },
      {
        "id": 101,
        "name": "TEST__Venue",
        "defaultTax": 14,
        "createdAt": "2022-11-04T18:28:18.000Z",
        "updatedAt": "2022-11-04T18:28:18.000Z"
      },
      {
        "id": 104,
        "name": "TEST__Venue",
        "defaultTax": 14,
        "createdAt": "2022-11-04T18:30:27.000Z",
        "updatedAt": "2022-11-04T18:30:27.000Z"
      }
    ]
  }
}
```

That means the total amount of venues is 10, but only 4 are returned.

## Query filters

You can filter by the entities fields when querying. It's needed to wrap them into the `filters` keyword. Example:

```
[GET] /api/venues?filters[defaultTax]=21
```

This call will retrieve all the venues with the `defaultTax` field equals to `21`.

```
[GET] /api/venues?filters[defaultTax][lte]=21
```

This call will retrieve all the venues their `defaultTax` field is less or equal than `21`. You can use these modifiers:

- adjacent

- all

- and

- any

- between

- col

- contained

- contains

- endsWith

- eq

- gt

- gte

- iLike

- in

- iRegexp

- is

- like

- lt

- lte

- match

- ne

- noExtendLeft

- noExtendRight

- not

- notBetween

- notILike

- notIn

- notIRegexp

- notLike

- notRegexp

- or

- overlap

- placeholder

- regexp

- startsWith

- strictLeft

- strictRight

- substring

- values
