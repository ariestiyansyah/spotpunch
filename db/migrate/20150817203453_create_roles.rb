class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.string      :name
      t.integer     :is_readable
      t.integer     :is_writable
      t.integer     :is_executable
      t.timestamps null: false
    end
  end
end
