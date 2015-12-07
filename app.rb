require 'sinatra'

get '/index' do
	erb :index
end

get '/alkanes' do 
	erb :alkanes
end

get '/alkenes' do
	erb :alkenes
end
get '/chairs' do 
	erb :chairs
end

get '/sample' do
	erb :sample
end

get '/newman' do
	erb :newman
end