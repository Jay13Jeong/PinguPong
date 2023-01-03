all :
	docker-compose up --build

clean :
	rm -rf ./pong_database/db

re : clean all

.PHONY: all clean re