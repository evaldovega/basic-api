# basic-api
## API basic guideline Condorlabs

###### List users

/api/v1/users

###### Filter by fullname, city or email
/api/v1/users?fullname=Armand Z. Torres

###### start of
/api/v1/users?fullname=*Armand

###### end of
/api/v1/users?fullname=Torres*

###### Containt
/api/v1/users?fullname=\*and Z.\*

##### Pagination

/api/v1/users?offset=0&limit=10

