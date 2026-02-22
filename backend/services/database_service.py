from services.supabase_service import SupabaseService
import logging


class DatabaseService:
    """
    Service to handle all database operations using Supabase.
    """

    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )

        self.logger = logging.getLogger(__name__)
        self.supabase = SupabaseService().get_client()

    def insert(self, table: str, data: dict) -> dict:
        """
        Insert data into a specified table.

        Args:
            table: Name of the table to insert into
            data: Dictionary containing the data to insert

        Returns:
            Response from the database operation

        Raises:
            Exception: If insert operation fails
        """
        try:
            response = self.supabase.table(table).insert(data).execute()
            self.logger.info(f"Data inserted into {table}: {response}")
        
            return response
        
        except Exception as e:
            self.logger.error(f"Error inserting data into {table}: {e}")
            raise e

    def fetch(self, table: str, filters: dict = None, modifiers: dict = None) -> dict:
        """
        Fetch data from a specified table with optional filters.

        Args:
            table: Name of the table to fetch from
            filters: Dictionary of filters to apply (e.g., {"id": "123"} or {"date": "gte.2026-01-01"})
                    Supports operators: gte, lte, gt, lt, neq (e.g., "gte.value")

        Returns:
            Response containing the fetched data

        Raises:
            Exception: If fetch operation fails
        """
        try:
            query = self.supabase.table(table).select("*")
            
            if filters:
                for key, value in filters.items():
                    # Check if value contains an operator prefix
                    if isinstance(value, str) and '.' in value:
                        operator_map = {
                            'gte': 'gte',  # greater than or equal
                            'lte': 'lte',  # less than or equal
                            'gt': 'gt',    # greater than
                            'lt': 'lt',    # less than
                            'neq': 'neq'   # not equal
                        }
                        
                        parts = value.split('.', 1)
                        if len(parts) == 2 and parts[0] in operator_map:
                            operator = parts[0]
                            actual_value = parts[1]
                            method = getattr(query, operator, None)
                            if method and callable(method):
                                query = method(key, actual_value)
                            else:
                                query = query.eq(key, value)
                        else:
                            query = query.eq(key, value)
                    else:
                        query = query.eq(key, value)
            
            if modifiers:
                for method_name, value in modifiers.items():
                    method = getattr(query, method_name, None)
                    if method and callable(method):
                        query = method(value)
                    else:
                        self.logger.warning(f"Method '{method_name}' not valid") 

            response = query.execute()
            self.logger.info(f"Data fetched from {table} with filters {filters}: {response}")
        
            return response
        
        except Exception as e:
            self.logger.error(f"Error fetching data from {table} with filters {filters}: {e}")
            raise e

    def update(self, table: str, data: dict, filters: dict) -> dict:
        """
        Update data in a specified table.

        Args:
            table: Name of the table to update
            data: Dictionary containing the data to update
            filters: Dictionary of filters to identify rows to update

        Returns:
            Response from the database operation

        Raises:
            Exception: If update operation fails
        """
        try:
            query = self.supabase.table(table).update(data)
            
            for key, value in filters.items():
                query = query.eq(key, value)
            
            response = query.execute()
            self.logger.info(f"Data updated in {table}: {response}")
        
            return response
        
        except Exception as e:
            self.logger.error(f"Error updating data in {table}: {e}")
            raise e

    def delete(self, table: str, filters: dict) -> dict:
        """
        Delete data from a specified table.

        Args:
            table: Name of the table to delete from
            filters: Dictionary of filters to identify rows to delete

        Returns:
            Response from the database operation

        Raises:
            Exception: If delete operation fails
        """
        try:
            query = self.supabase.table(table).delete()
            
            for key, value in filters.items():
                query = query.eq(key, value)
            
            response = query.execute()
            self.logger.info(f"Data deleted from {table}: {response}")
            return response
        except Exception as e:
            self.logger.error(f"Error deleting data from {table}: {e}")
            raise e
