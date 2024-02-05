# E-Commerce Website-Node
E-Commerce Website backend API using Node.js Express.js

1-User API: ["admin","seller","user"]
  * Auth User
    - Login
    - Logout
    - Signup
    - Singin and verify using email
    - Reset password , Forget password using email
    - Update My Password 
    - Deactivate My Account
    - Get My account data
  *only Admin
    - Get all users
    - get user by id
    - update user
    - delete user

2-Product API:
  *any user
    - Get all product with full query operations( paginate , sort, filter, limitFields)
    - Get all product that in the same category
    - Get specific product by id
  * admin or seller 
    - add Product [upload photo to cloud] 
    - Update product (by admin or the one create it )
    - Delete product (by admin or the one create it )

3-Category:
 *any user
   - Get all categories
   - Get specific category
 *admin or seller
  - addCategory
  - Update Category (by admin or the one create it )
  - Delete Category and all of his products (by admin or the one create it )
  - De-active Category and all of his products (by admin or the one create it )
  - Re-active Category and all of his products (by admin or the one create it )

4-Cart:
 - Create cart
 - Remove product from cart
 - Add product to cart
 - Update cart (by admin or the one create it )
 - Get All my Carts
 - delete cart by id
 - get cart by id
 - 
 - 

   
 - Apply coupon on cart if not applied to products
