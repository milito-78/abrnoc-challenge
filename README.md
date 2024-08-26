## Coupon Service
To run this project with docker, you need to follow this commands:

1. Copy .env.example to .env
2. Build container `docker compose build`
3. Run container `docker compose up -d`
4. Run application container terminal and run migrations. `yarn typeorm migration:run --d ./ormconfig.js`. You can exec terminal with this docker command : `docker compose exec -it {app_container_id} bash`

Now you can see application in `http://localhost:3000`.

## Data that you need

#### Users
| User             | Password     | Access Token                      |
|------------------|--------------|-----------------------------------|
| email1@coupon.co | Mm@123Coupon | cxcjjxbchcqdnw7cey67dadmjioc7dfec |
| email2@coupon.co | Mm@123Coupon | sahdsghadwqydftsgdhajskhdsdhjss   |

#### Servers
| Name         | Slug         |
|--------------|--------------|
| Server one   | server-one   |
| Server two   | Server two   |
| Server three | server-three |

#### Coupons
| Name            | Code  | Type   | Type Id      |
|-----------------|-------|--------|--------------|
| First coupon    | frst1 | Price  | ---          |
| Second coupon   | frst2 | Price  | ---          |
| Server coupon   | serv1 | Server | server-one   |
| Server coupon 3 | serv3 | Server | server-three |

### Docs
You can see postman collection in api_docs folder.


## License
[MIT license](https://opensource.org/licenses/MIT).

