# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
mall  = Mall.create(name: 'Central Park')
apple = Brand.create(name:'Apple')
uniqlo = Brand.create(name:'Uniqlo')
Store.create(name: 'Uniqlo', mall:mall, brand:uniqlo)
Store.create(name: 'Apple', mall:mall, brand:apple)