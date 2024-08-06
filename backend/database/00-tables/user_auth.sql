CREATE TABLE IF NOT EXISTS public.hashing_algorithm (
    id serial PRIMARY KEY,
    algorithm_name varchar(10) NOT NULL
);
INSERT INTO public.hashing_algorithm (algorithm_name) VALUES ('scrypt');


CREATE TABLE IF NOT EXISTS public.email_validation_status (
    id serial PRIMARY KEY,
    status_description varchar(30) NOT NULL
);
INSERT INTO public.email_validation_status (status_description) VALUES ('pending');
INSERT INTO public.email_validation_status (status_description) VALUES ('not_validated');
INSERT INTO public.email_validation_status (status_description) VALUES ('validated');


CREATE TABLE IF NOT EXISTS public.user_login_data (
    user_id integer PRIMARY KEY,
    username varchar(32) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    
    password_hash varchar(250) NOT NULL,
    password_hashing_algorithm_id integer NOT NULL,

    confirmation_token varchar(100),
    token_genration_time timestamp,

    email_validation_status_id integer NOT NULL,

    password_recovery_token varchar(100),
    password_recovery_token_genration_time timestamp,

    registration_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.user_login_data ADD CONSTRAINT fk_user_login_data_hashing_algorithm_id FOREIGN KEY (password_hashing_algorithm_id) REFERENCES public.hashing_algorithm(id);
ALTER TABLE public.user_login_data ADD CONSTRAINT fk_user_login_data_email_validation_status_id FOREIGN KEY (email_validation_status_id) REFERENCES public.email_validation_status(id);


CREATE TABLE IF NOT EXISTS public.user_profiles (
    id serial PRIMARY KEY,
    first_name varchar(100),
    last_name varchar(100),
    gender varchar(20),
    date_of_birth date,
    accept_terms_of_service boolean NOT NULL,
    time_zone varchar(100) NOT NULL
);
ALTER TABLE public.user_login_data ADD CONSTRAINT fk_user_login_data_user_id FOREIGN KEY (id) REFERENCES public.user_login_data(user_id);


CREATE TABLE IF NOT EXISTS public.login_attempts (
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    login_time timestamp NOT NULL,
    login_status boolean NOT NULL,
    ip_address varchar(15) NOT NULL,
    browser_type varchar(100) NOT NULL
);
ALTER TABLE public.login_attempts ADD CONSTRAINT fk_login_attempts_user_id FOREIGN KEY (user_id) REFERENCES public.user_login_data(user_id);

