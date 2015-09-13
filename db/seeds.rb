# First Seed
# mall          = Mall.find_or_create_by(name: 'Central Park')
# apple         = Brand.find_or_create_by(name:'Apple')
# uniqlo        = Brand.find_or_create_by(name:'Uniqlo')
# uniqlo_store  = Store.find_or_create_by(name: 'Uniqlo', mall:mall, brand:uniqlo, permalink:"uniqlo")
# # uniqlo_store.to_slug
# # uniqlo_store.save
# ibox_store    = Store.find_or_create_by(name: 'Ibox', mall:mall, brand:apple, permalink:"ibox")
# # ibox_store.to_slug
# # ibox_store.save
# product       = Product.find_or_create_by(name:"Iphone 6", brand:apple)
# user          = User.first
# review        = Review.new content:"Bagus", product:product, score:4, user:user, store:ibox_store
# review.save
# review.create_activity key: 'review.create', owner: User.first

# Second Seed 13 Sept 2015
product       = Product.find_or_create_by(name:"Iphone 6")
ibox_store    = Store.find_by_permalink "ibox"
product_store = StoreProduct.new product:product, store:ibox_store
product_store.save