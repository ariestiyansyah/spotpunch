class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.text     "content",       limit: 65535
      t.integer  "score",         limit: 5,     default: 0
      t.integer  "product_id"
      t.integer  "user_id"
      t.timestamps null: false
    end
  end
end
