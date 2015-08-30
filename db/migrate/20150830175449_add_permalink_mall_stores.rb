class AddPermalinkMallStores < ActiveRecord::Migration
  def change
    add_column :malls,    :permalink, :string
    add_column :stores,   :permalink, :string
  end
end
