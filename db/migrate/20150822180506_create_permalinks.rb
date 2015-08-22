class CreatePermalinks < ActiveRecord::Migration
  def change
    create_table :permalinks do |t|
      t.string    :name
      t.integer   :linkable_id
      t.string    :linkable_type
      t.timestamps null: false
    end
    add_index :permalinks, :linkable_id
    add_index :permalinks, :name,                 unique: true
  end
end
