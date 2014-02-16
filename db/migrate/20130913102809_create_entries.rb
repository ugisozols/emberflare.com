class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.references :user
      t.string :author_name
      t.string :title
      t.text   :content

      t.timestamps
    end
  end
end
