INSERT INTO users (name, email, role, plan)
VALUES ('Rajesh', 'rgangula79@gmail.com', 'admin', 'premium')
ON CONFLICT (email) DO UPDATE SET role='admin', plan='premium', name='Rajesh';
