# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150830103337) do

  create_table "activities", force: :cascade do |t|
    t.integer  "trackable_id",   limit: 4
    t.string   "trackable_type", limit: 255
    t.integer  "owner_id",       limit: 4
    t.string   "owner_type",     limit: 255
    t.string   "key",            limit: 255
    t.text     "parameters",     limit: 65535
    t.integer  "recipient_id",   limit: 4
    t.string   "recipient_type", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type", using: :btree
  add_index "activities", ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type", using: :btree
  add_index "activities", ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type", using: :btree

  create_table "brands", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "floors", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "follows", force: :cascade do |t|
    t.integer  "followable_id",   limit: 4,                   null: false
    t.string   "followable_type", limit: 255,                 null: false
    t.integer  "follower_id",     limit: 4,                   null: false
    t.string   "follower_type",   limit: 255,                 null: false
    t.boolean  "blocked",                     default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "follows", ["followable_id", "followable_type"], name: "fk_followables", using: :btree
  add_index "follows", ["follower_id", "follower_type"], name: "fk_follows", using: :btree

  create_table "malls", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "address",    limit: 255
    t.string   "latitude",   limit: 255
    t.string   "longitude",  limit: 255
    t.string   "city",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "permalinks", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.integer  "linkable_id",   limit: 4
    t.string   "linkable_type", limit: 255
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "permalinks", ["linkable_id"], name: "index_permalinks_on_linkable_id", using: :btree
  add_index "permalinks", ["name"], name: "index_permalinks_on_name", unique: true, using: :btree

  create_table "products", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.integer  "store_id",    limit: 4
    t.text     "description", limit: 65535
    t.integer  "category_id", limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.integer  "brand_id",    limit: 4
  end

  create_table "promotions", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.text     "description", limit: 65535
    t.integer  "store_id",    limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "reviews", force: :cascade do |t|
    t.text     "content",    limit: 65535
    t.integer  "score",      limit: 8,     default: 0
    t.integer  "product_id", limit: 4
    t.integer  "user_id",    limit: 4
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.integer  "is_readable",   limit: 4
    t.integer  "is_writable",   limit: 4
    t.integer  "is_executable", limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "stores", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.integer  "mall_id",     limit: 4
    t.integer  "floor_id",    limit: 4
    t.integer  "category_id", limit: 4
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.integer  "brand_id",    limit: 4
  end

  create_table "user_roles", force: :cascade do |t|
    t.string   "name",            limit: 255
    t.string   "accessible_type", limit: 255
    t.integer  "accessible_id",   limit: 4
    t.integer  "user_id",         limit: 4
    t.integer  "role_id",         limit: 4
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "username",               limit: 255, default: "", null: false
    t.string   "firstname",              limit: 255
    t.string   "lastname",               limit: 255
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

end
