# USMCA
Web app for the [United States Math Competition Association](usmath.org).

## For Users

### Terms
* **Admin**: An administrator of USMCA. The Admin has the privilege of declaring competitions and its directors. The directors then take over the administration of the competition.
* **Competition**: An organization that hosts contests, e.g. PUMaC, CMIMC.
* **Contest**: A single event by a participating organization, e.g. PUMaC 2018. An organization can have multiple contests.
* **Test**: A single round of a contest, such as CMIMC Algebra Round or PUMaC Individual Finals.
* **User**: A single person who carries out certain roles to contests. Users have various privileges with respect to competitions and contests:
  * **Director**:
    Directors “own” their competition, and thus have access to all aspects of it.
    In addition to Czars’ permissions, Directors may change the permissions of
    their competition’s members, invite new members to join the competition,
    and approve new members’ requests to join.
  * **Czar**:
    Problem czars are the head problem writers for their competitions.
    They have full control over their competition’s database and contests.
    In addition to Officers’ permissions, czars can create new contests and tests,
    and assign and unassign problems from the database to a contest.
  * **Officer**:
    In addition to Members’ permissions, Officers can view their competition’s
    database, and have edit access to all problems.
  * **Member** (of a competition):
    Members can propose problems to a competition and have edit access to their
    own proposals.

### Obtaining Privileges
* Becoming an Admin
  * An Admin can invite anyone to become an Admin
* Becoming a Director
  * Anyone can request an Admin to start a competition and become its first Director or become the Director of a competition without (active) Directors
  * A Director can appoint a Member to become a Director
* Becoming a Czar
  * A Director can appoint a Member to become a Czar
* Becoming an Officer
  * A Director can appoint a Member to become an Officer
* Becoming a Member
  * Anyone can request a Director to become a Member
  * A Director can invite anyone to become a Member

## For Developers

### Project Structure
This project runs a node server and a MongoDB database and serves a frontend based on React/Redux and Materialize.

### Set Up
* Install [MongoDB](docs.mongodb.com/manual/installation/).
* Populate a `.env` in the root directory with the MongoDB url `DB_URL`, the server port `PORT`, and a JWT secret `JWT_SECRET`
* Install node packages (including React and Redux) with `npm install`
* Start the Mongo database with `mongod`.
* In another terminal, build the React source with `npm run watch` (`npm run build` for production)
* In another terminal, start the server with `npm run dev` (`npm start` for production)
