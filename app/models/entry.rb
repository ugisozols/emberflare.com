class Entry < ActiveRecord::Base
  validates :title, :content, :presence => true
end
